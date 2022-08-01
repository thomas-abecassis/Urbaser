<?php

namespace App\Controller;

use App\Entity\Admin;
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

class APIController extends AbstractController
{

    private $entityManager;
    const DEFAULT_PASSWORD = "EntEnt2022";

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->entityManager = $doctrine->getManager();
    }

            /**
     * @Route("/api/admin/resetPassword", name="api_resetPassword")
     */
    public function resetPassword(Request $request,UserPasswordHasherInterface $hasher){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $username  = json_decode($request->request->get('username'));

        $repoDepot = $this->entityManager->getRepository(Admin::class);

        $admin = $repoDepot->findOneByUsername($username);

        if ($admin) return $response->setContent(json_encode(array("code" => -3)));

        $hasedPassword = $hasher->hashPassword($admin, self::DEFAULT_PASSWORD);
        $admin->setPassword($hasedPassword);
        
        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        return $response->setContent(json_encode(array("code" => 1)));
    }

        /**
     * @Route("/api/admin/createUser", name="api_createUser")
     */
    public function createUser(Request $request,UserPasswordHasherInterface $hasher){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $credentials  = json_decode($request->request->get('credentials'));
        $username = $credentials->username;
        $repoDepot = $this->entityManager->getRepository(Admin::class);

        $admin = $repoDepot->findOneByUsername($username);

        if ($admin) return $response->setContent(json_encode(array("code" => -3)));

        $password = $credentials->password;
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
    public function uploadTools( Request $request, SluggerInterface $slugger)
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
     * @Route("/api/admin/users", name="api_tools")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getUsers(Request $request){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $repoAdmin = $this->entityManager->getRepository(Admin::class);
        $admins = $repoAdmin->getAll();
        $adminsJson = array();

        foreach ($admins as $admin) {
            $adminsJson[] = array("id" => $admin->getId(),"username" => $admin->getUsername(),"depot" => null);
        }

        return $response->setContent(json_encode($adminsJson));
    }

    /**
     * @Route("/api/tools/{depotSlug}", name="api_tools")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getTools($depotSlug)
    {
        $repoDepot = $this->entityManager->getRepository(Depot::class);

        $depot = $repoDepot->findOneBySlug($depotSlug);
        $buttons = $depot->getButtons();

        $buttonsArray = [];

        foreach ($buttons as $button) {
            array_push($buttonsArray, [
                "name" => $button->getName(),
                "url" => $button->getUrl(),
                "id" => $button->getId(),
            ]);
        }


        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($buttonsArray));

        return $response;
    }

    /**
     * @Route("/api/admin/getDepots", name="api_getDepots")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getDepots(){
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $repoDepots = $this->entityManager->getRepository(Depot::class);
        $depots = $repoDepots->getAll();
        $depotsJson = array();

        foreach ($depots as $depot) {
            $depotsJson[] = array("id" => $depot->getId(),"name" => $depot->getName());
        }

        return $response->setContent(json_encode($depotsJson));
    }
}
