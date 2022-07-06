<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220705120621 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE button_depot (button_id INT NOT NULL, depot_id INT NOT NULL, INDEX IDX_CC083E5EA123E519 (button_id), INDEX IDX_CC083E5E8510D4DE (depot_id), PRIMARY KEY(button_id, depot_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE depot (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE button_depot ADD CONSTRAINT FK_CC083E5EA123E519 FOREIGN KEY (button_id) REFERENCES button (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE button_depot ADD CONSTRAINT FK_CC083E5E8510D4DE FOREIGN KEY (depot_id) REFERENCES depot (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE button_depot DROP FOREIGN KEY FK_CC083E5E8510D4DE');
        $this->addSql('DROP TABLE button_depot');
        $this->addSql('DROP TABLE depot');
    }
}
