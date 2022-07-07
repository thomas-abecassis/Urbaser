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
     * @Route("/{depotSlug}", name="app_home")
     */
    public function index(): Response
    {

        $repoDepot = $this->entityManager->getRepository(Depot::class);
        $depot = $repoDepot->findOneBySlug("toast");
        $background = $depot->getBackground();

        return $this->render('home/index.html.twig', [
            'img' => $background->getIllustration(),
        ]);
    }
}
