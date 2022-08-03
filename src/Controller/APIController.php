<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\AdminDepot;
use App\Entity\Depot;
use App\Entity\Button;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class APIController extends AbstractController
{

    private $entityManager;
    const DEFAULT_PASSWORD = "EntEnt2022";

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->entityManager = $doctrine->getManager();
    }

        /**
     * @Route("/api/admin/createDepot", name="api_createDepot")
     */
    public function createDepot(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        if( !$this->isGranted('ROLE_ADMIN'))   
            return $response->setContent(json_encode(array("code" => -1)));

        $depotName  = $request->request->get('depotName');
        $depotSlug  = $request->request->get('depotSlug');

        $repoDepot = $this->entityManager->getRepository(Depot::class);
        $depot = $repoDepot->findBySlug($depotSlug);
        if($depot)
            return $response->setContent(json_encode(array("code" => -3)));

        $depot = new Depot($depotName, $depotSlug);
        $this->entityManager->persist($depot);
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }

        /**
     * @Route("/api/admin/editUser", name="api_editUser")
     */
    public function editUser(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $newPassword  = $request->request->get('newPassword');

        $user = $this->getUser();

        if (!$user) return $response->setContent(json_encode(array("code" => -1)));

        if($newPassword)
            $user->setPassword($newPassword);

        //le mot de passe est automatiquement hash par l'event listener 
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }


    /**
     * @Route("/api/admin/role", name="api_role")
     */
    public function role(TokenStorageInterface $tokenStorageInterface){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        if ($this->isGranted('ROLE_ADMIN'))
            return $response->setContent(json_encode(array("code" => 1, "data" => array("adminType" => 2, "depot" => null))));
        
        
        if ($this->isGranted('ROLE_ADMIN_DEPOT'))
            return $response->setContent(json_encode(array("code" => 1, "data" => array("adminType" => 1, "depot" => $this->getUser()->getDepot()->getSlug()))));
        
        
        return $response->setContent(json_encode(array("code" => -1)));
    }


    /**
     * @Route("/api/admin/resetPassword", name="api_resetPassword")
     */
    public function resetPassword(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $username  = $request->request->get('username');

        $repoAdminDepot = $this->entityManager->getRepository(AdminDepot::class);

        $admin = $repoAdminDepot->findOneByUsername($username);

        if (!$admin  && $this->isGranted('ROLE_ADMIN')){
            $repoAdmin = $this->entityManager->getRepository(Admin::class);
            $admin = $repoAdmin->findOneByUsername($username);
        }

        if (!$admin) return $response->setContent(json_encode(array("code" => -3)));

        if(!$this->isGranted('ROLE_ADMIN') && $admin->getDepot()->getSlug()!=$this->getUser()->getDepot()->getSlug())
            return $response->setContent(json_encode(array("code" => -3)));

        $admin->setPassword(self::DEFAULT_PASSWORD);
        
        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }

    /**
     * @Route("/api/admin/deleteUser", name="api_deleteUser")
     */
    public function deleteUser(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $username  = $request->request->get('username');

        $repoAdminDepot = $this->entityManager->getRepository(AdminDepot::class);

        $admin = $repoAdminDepot->findOneByUsername($username);

        if (!$admin  && $this->isGranted('ROLE_ADMIN')){
            $repoAdmin = $this->entityManager->getRepository(Admin::class);
            $admin = $repoAdmin->findOneByUsername($username);
        }

        if (!$admin) return $response->setContent(json_encode(array("code" => -3)));
        if(!$this->isGranted('ROLE_ADMIN') && $admin->getDepot()->getSlug()!=$this->getUser()->getDepot()->getSlug())
            return $response->setContent(json_encode(array("code" => -3)));
        
        $this->entityManager->remove($admin);
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }

    /**
     * @Route("/api/admin/createUser", name="api_createUser")
     */
    public function createUser(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $credentials = json_decode($request->request->get('credentials'));
        $adminType = $request->request->get('adminType');
        $depotSlug = $request->request->get('depot');
        $username = $credentials->username;
        $password = $credentials->password;
        $repoAdmin = $this->entityManager->getRepository(Admin::class);
        $repoAdminDepot = $this->entityManager->getRepository(AdminDepot::class);

        if($adminType==2 && !$this->isGranted('ROLE_ADMIN'))   
            return $response->setContent(json_encode(array("code" => -1)));

        $admin = $repoAdmin->findOneByUsername($username);
        if ($admin) return $response->setContent(json_encode(array("code" => -3)));

        $admin = $repoAdminDepot->findOneByUsername($username);
        if ($admin) return $response->setContent(json_encode(array("code" => -3)));

        if($adminType==1){
            if(!$this->isGranted('ROLE_ADMIN') && $this->getUser()->getDepot()->getSlug()!=$depotSlug)   
                return $response->setContent(json_encode(array("code" => -1)));

            $repoDepot = $this->entityManager->getRepository(Depot::class);
            $depot = $repoDepot->findOneBySlug($depotSlug);
            $admin = new AdminDepot($username, $password,$depot);
        }

        else if($adminType==2)
            $admin = new Admin($username, $password);

        //le mot de passe est automatiquement hash par l'event listener 
        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }



    /**
     * @Route("/api/admin/uploadImage", name="api_uploadImage")
     */
    public function uploadImage( Request $request, SluggerInterface $slugger)
    {

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $image = $request->files->get('image');
        $depotSlug = $request->request->get('depot');

        if(!$this->isGranted('ROLE_ADMIN') && $this->getUser()->getDepot()->getSlug()!=$depotSlug)   
            return $response->setContent(json_encode(array("code" => -3)));

        $repoDepot = $this->entityManager->getRepository(Depot::class);

        $depot = $repoDepot->findOneBySlug($depotSlug);

        if (!$depot) return $response->setContent(json_encode(array("code" => -3)));

        $originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$image->guessExtension();

        $depot->setImage($newFilename);
        $this->entityManager->persist($depot);
        $this->entityManager->flush();

        $rootDir = $this->getParameter('kernel.project_dir');

        try {
            $image->move(
                $rootDir."/public/uploads",
                $newFilename
            );
        } catch (FileException $e) {
            return $response->setContent(-1);
        }

        return $response->setContent(json_encode(array("code" => 1, "file" => $newFilename)));
    }

    /**
     * @Route("/api/admin/uploadTools", name="api_uploadTools")
     */
    public function uploadTools( Request $request)
    {

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $depotSlug = $request->request->get('depot');

        if(!$this->isGranted('ROLE_ADMIN') && $this->getUser()->getDepot()->getSlug()!=$depotSlug)   
            return $response->setContent(json_encode(array("code" => -3))); 

        $repoDepot = $this->entityManager->getRepository(Depot::class);
        $repoButton = $this->entityManager->getRepository(Button::class);


        $depot = $repoDepot->findOneBySlug($depotSlug);

        if (!$depot) return $response->setContent(json_encode(array("code" => -3)));

        $buttonsUpload = json_decode($request->request->get('tools'));

        foreach ($buttonsUpload as  $buttonUpload) {
            $prevButton = $repoButton->findOneById($buttonUpload->id);
            if($prevButton){
                $prevButton->setName($buttonUpload->name);
                $prevButton->setUrl($buttonUpload->url);
                $this->entityManager->persist($prevButton);
            }   
        }
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }

    /**
     * @Route("/api/admin/users", name="api_users")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getUsers(){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $adminsJson = array();

        $repoAdminDepot = $this->entityManager->getRepository(AdminDepot::class);
        $adminsDepot = $repoAdminDepot->findAll();

        foreach ($adminsDepot as $admin) {
            if($admin!=$this->getUser() && (!$this->isGranted('ROLE_ADMIN') && $admin->getDepot()->getSlug()==$this->getUser()->getDepot()->getSlug() || $this->isGranted('ROLE_ADMIN')))
                $adminsJson[] = array("id" => $admin->getId(),"username" => $admin->getUsername(),"depot" => $admin->getDepot()->getSlug());
        }

        if($this->isGranted('ROLE_ADMIN')){
            $repoAdmin = $this->entityManager->getRepository(Admin::class);
            $admins = $repoAdmin->findAll();
            foreach ($admins as $admin) {
                if($admin!=$this->getUser())
                    $adminsJson[] = array("id" => $admin->getId(),"username" => $admin->getUsername(),"depot" => null);
            }
        }


        if (!$admin) return $response->setContent(json_encode(array("code" => -3)));


        return $response->setContent(json_encode(array("code" => 1, "users" => $adminsJson)));
    }

    /**
     * @Route("/api/tools/{depotSlug}", name="api_tools")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getTools($depotSlug)
    {
        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $repoDepot = $this->entityManager->getRepository(Depot::class);

        $depot = $repoDepot->findOneBySlug($depotSlug);

        if(!$depot)
            return $response->setContent(json_encode(array("code"=>-1)));

        $buttons = $depot->getButtons();
        $image = $depot->getImage();

        $buttonsArray = [];

        foreach ($buttons as $button) {
            array_push($buttonsArray, [
                "name" => $button->getName(),
                "url" => $button->getUrl(),
                "id" => $button->getId(),
            ]);
        }



        $response->setContent(json_encode(array("code"=>1,"data" => array("tools" => $buttonsArray, "image" => $image))));

        return $response;
    }

    /**
     * @Route("/api/admin/depots", name="api_depots")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getDepots(){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $repoDepots = $this->entityManager->getRepository(Depot::class);
        $depots = $repoDepots->findAll();
        $depotsJson = array();

        foreach ($depots as $depot) {
            $depotsJson[] = array("id" => $depot->getId(),"name" => $depot->getName(), "slug" => $depot->getSlug());
        }

        return $response->setContent(json_encode(array("code" => 1, "data" =>$depotsJson)));
    }
}
