<?php

namespace App\Controller\Admin;

use App\Entity\Admin;
use App\Entity\Depot;
use App\Entity\Button;
use App\Entity\AdminDepot;
use App\Controller\Admin\ButtonCrudController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="app_admin")
     */
    public function index(): Response
    {
        $routeBuilder = $this->container->get(AdminUrlGenerator::class);
        $url = $routeBuilder->setController(ButtonCrudController::class)->generateUrl();
        return $this->redirect($url);
    }
    
    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Urbaser');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('Outils', 'fas fa-toolbox', Button::class);
        yield MenuItem::linkToCrud('Depots', 'fas fa-building', Depot::class);
        yield MenuItem::linkToCrud('Admin', 'fas fa-user', Admin::class);
        yield MenuItem::linkToCrud('Admin de dépot', 'fas fa-user', AdminDepot::class);

    }
}
