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

    #[ORM\Column(type: 'string', length: 255)]
    private $image;

    #[ORM\OneToMany(mappedBy: 'depot', targetEntity: AdminDepot::class)]
    private $adminDepots;


    public function __construct($name = null, $slug = null)
    {
        $this->name = $name;
        $this->slug = $slug;
        $this->buttons = new ArrayCollection();
        $this->adminDepots = new ArrayCollection();
        $this->image = "defaultBackground.jpg";
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

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): self
    {
        $this->image = $image;

        return $this;
    }

    /**
     * @return Collection<int, AdminDepot>
     */
    public function getAdminDepots(): Collection
    {
        return $this->adminDepots;
    }

    public function addAdminDepot(AdminDepot $adminDepot): self
    {
        if (!$this->adminDepots->contains($adminDepot)) {
            $this->adminDepots[] = $adminDepot;
            $adminDepot->setDepot($this);
        }

        return $this;
    }

    public function removeAdminDepot(AdminDepot $adminDepot): self
    {
        if ($this->adminDepots->removeElement($adminDepot)) {
            // set the owning side to null (unless already changed)
            if ($adminDepot->getDepot() === $this) {
                $adminDepot->setDepot(null);
            }
        }

        return $this;
    }
}
