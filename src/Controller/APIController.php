<?php

namespace App\Controller;

use App\Entity\Depot;
use App\Entity\Button;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class APIController extends AbstractController
{

    private $entityManager;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->entityManager = $doctrine->getManager();
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
                "url" => $button->getUrl()
            ]);
        }


        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($buttonsArray));

        return $response;
    }
}
