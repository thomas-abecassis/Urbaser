<?php

namespace App\Controller;

use App\Entity\Depot;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{

    private $entityManager;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->entityManager = $doctrine->getManager();
    }

    /**
     * @Route("/{depotSlug?}", name="app_home")
     */
    public function index($depotSlug): Response
    {
        $repoDepot = $this->entityManager->getRepository(Depot::class);
        $depot = $repoDepot->findOneBySlug($depotSlug);
        $img = "defaultBackground.jpg";
        if($depot)
            $img = $depot->getImage();
        

        return $this->render('home/index.html.twig', [
            'img' => $img,
        ]);
    }
}
    