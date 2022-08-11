<?php

namespace App\Controller\Admin;

use App\Entity\Button;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;

class ButtonCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Button::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IntegerField::new('id'),
            TextField::new('name'),
            TextField::new('url'),
            AssociationField::new("depot"),
        ];
    }
}
