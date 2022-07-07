<?php

namespace App\Entity;

use App\Repository\DepotRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DepotRepository::class)]
class Depot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'string', length: 255)]
    private $slug;

    #[ORM\ManyToMany(targetEntity: Button::class, mappedBy: 'depot')]
    private $buttons;

    #[ORM\OneToOne(mappedBy: 'depot', targetEntity: Background::class, cascade: ['persist', 'remove'])]
    private $background;

    public function __construct()
    {
        $this->buttons = new ArrayCollection();
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * @return Collection<int, Button>
     */
    public function getButtons(): Collection
    {
        return $this->buttons;
    }

    public function addButton(Button $button): self
    {
        if (!$this->buttons->contains($button)) {
            $this->buttons[] = $button;
            $button->addDepot($this);
        }

        return $this;
    }

    public function removeButton(Button $button): self
    {
        if ($this->buttons->removeElement($button)) {
            $button->removeDepot($this);
        }

        return $this;
    }

    public function __toString()
    {
        return $this->getName();
    }

    public function getBackground(): ?Background
    {
        return $this->background;
    }

    public function setBackground(?Background $background): self
    {
        // unset the owning side of the relation if necessary
        if ($background === null && $this->background !== null) {
            $this->background->setDepot(null);
        }

        // set the owning side of the relation if necessary
        if ($background !== null && $background->getDepot() !== $this) {
            $background->setDepot($this);
        }

        $this->background = $background;

        return $this;
    }
}
