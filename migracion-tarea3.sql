USE `tarea2`;

ALTER TABLE `avistamiento`
  ADD COLUMN `tipo_ave` VARCHAR(50) NOT NULL DEFAULT 'Otra';
