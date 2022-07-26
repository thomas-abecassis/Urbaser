<?php

namespace App\Controller;

use App\Entity\Depot;
use App\Entity\Button;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class APIController extends AbstractController
{

    private $entityManager;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->entityManager = $doctrine->getManager();
    }

        /**
     * @Route("/api/uploadImage", name="api_uploadImage")
     */
    public function uploadImage( Request $request, SluggerInterface $slugger)
    {

        $response = new Response();

        $image = $request->files->get('image');
        $depotSlug = $request->request->get('depot');
        $repoDepot = $this->entityManager->getRepository(Depot::class);

        $depot = $repoDepot->findOneBySlug($depotSlug);

        if (!$depot) return $response->setContent(-1);

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

        return $response->setContent($newFilename);
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
}
