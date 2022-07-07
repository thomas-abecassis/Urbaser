<?php

namespace App\Controller\Admin;

use App\Entity\Background;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class BackgroundCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Background::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            ImageField::new("illustration")->setUploadDir('public/uploads')->setBasePath('uploads')
                ->setUploadedFileNamePattern('[randomhash],[extension]'),
                AssociationField::new("depot"),
        ];
    }
}
