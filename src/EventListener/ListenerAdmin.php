<?php 

namespace App\EventListener;

use App\Entity\Admin;
use Psr\Log\LoggerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class ListenerAdmin implements EventSubscriberInterface
{

    private $logger;
    private $hasher;

    public function __construct( LoggerInterface $logger, UserPasswordHasherInterface $hasher)
    {
        $this->logger = $logger;
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


        $this->logger->info($password=$admin->getPassword());

        if (!($admin instanceof Admin)) {
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