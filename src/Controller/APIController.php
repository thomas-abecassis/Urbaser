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
        $user = $tokenStorageInterface->getToken()->getUser();
        $roles = $user->getRoles();

        if (in_array('ROLE_ADMIN',$roles, true))
        return $response->setContent(json_encode(array("code" => 2)));
        
        if (in_array('ROLE_ADMIN_DEPOT',$roles, true))
            return $response->setContent(json_encode(array("code" => 1)));
        
        return $response->setContent(json_encode(array("code" => -1)));
    }


    /**
     * @Route("/api/admin/resetPassword", name="api_resetPassword")
     */
    public function resetPassword(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $id  = json_decode($request->request->get('id'));

        $repoDepot = $this->entityManager->getRepository(Admin::class);

        $admin = $repoDepot->findOneById($id);

        if (!$admin) return $response->setContent(json_encode(array("code" => -3)));

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

        $id  = json_decode($request->request->get('id'));

        $repoDepot = $this->entityManager->getRepository(Admin::class);

        $admin = $repoDepot->findOneById($id);

        if (!$admin) return $response->setContent(json_encode(array("code" => -3)));
        
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

        $admin = $repoAdmin->findOneByUsername($username);

        if ($admin) return $response->setContent(json_encode(array("code" => -3)));

        if($adminType==1){
            $repoDepot = $this->entityManager->getRepository(Depot::class);
            $depot = $repoDepot->findBySlug($depotSlug);
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
    public function getUsers(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $repoAdmin = $this->entityManager->getRepository(Admin::class);
        $admins = $repoAdmin->findAll();
        $adminsJson = array();

        foreach ($admins as $admin) {
            $adminsJson[] = array("id" => $admin->getId(),"username" => $admin->getUsername(),"depot" => null);
        }

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
