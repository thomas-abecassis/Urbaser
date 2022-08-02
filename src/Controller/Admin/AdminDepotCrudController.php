<?php

namespace App\Controller\Admin;

use App\Entity\AdminDepot;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class AdminDepotCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return AdminDepot::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('username'),
            TextField::new('password'),
            AssociationField::new("depot"),
        ];
    }
    
}
