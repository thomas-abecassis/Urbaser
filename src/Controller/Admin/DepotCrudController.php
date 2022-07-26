<?php

namespace App\Controller\Admin;

use App\Entity\Depot;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

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
            ImageField::new("image")->setUploadDir('public/uploads')->setBasePath('uploads')
            ->setUploadedFileNamePattern('[randomhash].[extension]'),
        ];
    }
}
