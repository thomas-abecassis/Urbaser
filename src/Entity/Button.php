<?php

namespace App\Entity;

use App\Repository\ButtonRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ButtonRepository::class)]
class Button
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'string', length: 255)]
    private $url;

    #[ORM\ManyToOne(targetEntity: Depot::class, inversedBy: 'buttons')]
    #[ORM\JoinColumn(nullable: false)]
    private $depot;

    public function __construct($name =null, $url = null, $depot = null)
    {
        $this->name = $name;
        $this->url = $url;
        $this->depot = $depot;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getDepot(): ?depot
    {
        return $this->depot;
    }

    public function setDepot(?depot $depot): self
    {
        $this->depot = $depot;

        return $this;
    }
}
