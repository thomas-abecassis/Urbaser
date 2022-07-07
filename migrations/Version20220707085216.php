<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220707085216 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE background ADD depot_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE background ADD CONSTRAINT FK_BC68B4508510D4DE FOREIGN KEY (depot_id) REFERENCES depot (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_BC68B4508510D4DE ON background (depot_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE background DROP FOREIGN KEY FK_BC68B4508510D4DE');
        $this->addSql('DROP INDEX UNIQ_BC68B4508510D4DE ON background');
        $this->addSql('ALTER TABLE background DROP depot_id');
    }
}
