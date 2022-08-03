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
     * @Route("/depot/{depotSlug?}", name="app_home")
     */
    public function index($depotSlug): Response
    {
        $repoDepot = $this->entityManager->getRepository(Depot::class);
        $depot = $repoDepot->findOneBySlug($depotSlug);

        return $this->render('home/index.html.twig');
    }

        /**
     * @Route("/logins", name="app_loginForm")
     */
    public function loginForm(): Response
    {   
        $tokenProvider = $this->container->get('security.csrf.token_manager');
        $token = $tokenProvider->getToken('example')->getValue();
        return $this->render('home/index.html.twig',["crsf" => $token]);
    }
}
    