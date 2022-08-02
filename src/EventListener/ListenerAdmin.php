<?php 

namespace App\EventListener;

use App\Entity\Admin;
use Doctrine\ORM\Events;
use App\Entity\AdminDepot;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;

class ListenerAdmin implements EventSubscriberInterface
{

    private $hasher;

    public function __construct( UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate
        ];
    }

    private function hashPassword($admin){        

        if (!($admin instanceof Admin) && !($admin instanceof AdminDepot)) {
            return;
        }

        $password=$admin->getPassword();
        $password = $this->hasher->hashPassword($admin, $password);
        $admin->setPassword($password);
    }

    public function preUpdate(LifecycleEventArgs $event)
    {
        $admin = $event->getObject();
        $this->hashPassword($admin);
    }

    public function prePersist(LifecycleEventArgs $event)
    {
        $admin = $event->getObject();
        $this->hashPassword($admin);
    }
}