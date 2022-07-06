<?php

namespace App\Controller\Admin;

use App\Entity\Depot;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

class DepotCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Depot::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name'),
            TextField::new('slug'),
            AssociationField::new('buttons'),
        ];
    }
}
