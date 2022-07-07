<?php

namespace App\Entity;

use App\Repository\BackgroundRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BackgroundRepository::class)]
class Background
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $illustration;

    #[ORM\OneToOne(inversedBy: 'background', targetEntity: Depot::class, cascade: ['persist', 'remove'])]
    private $depot;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIllustration(): ?string
    {
        return $this->illustration;
    }

    public function setIllustration(string $illustration): self
    {
        $this->illustration = $illustration;

        return $this;
    }

    public function getDepot(): ?Depot
    {
        return $this->depot;
    }

    public function setDepot(?Depot $depot): self
    {
        $this->depot = $depot;

        return $this;
    }
}
