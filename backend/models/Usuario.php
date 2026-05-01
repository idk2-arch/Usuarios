<?php

class Usuario {
    private $conn;
    private $tabla = "usuarios";

    public $id;
    public $nombre;
    public $email;
    public $telefono;
    public $creado_en;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function leerTodos() {
        $query = "SELECT id, nombre, email, telefono, creado_en
                  FROM {$this->tabla}
                  ORDER BY creado_en DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function leerUno() {
        $query = "SELECT id, nombre, email, telefono, creado_en
                  FROM {$this->tabla}
                  WHERE id = :id
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $fila = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($fila) {
            $this->nombre   = $fila["nombre"];
            $this->email    = $fila["email"];
            $this->telefono = $fila["telefono"];
            return true;
        }
        return false;
    }

    public function crear() {
        $query = "INSERT INTO {$this->tabla} (nombre, email, telefono)
                  VALUES (:nombre, :email, :telefono)";
        $stmt = $this->conn->prepare($query);

        $this->nombre   = htmlspecialchars(strip_tags($this->nombre));
        $this->email    = htmlspecialchars(strip_tags($this->email));
        $this->telefono = htmlspecialchars(strip_tags($this->telefono));

        $stmt->bindParam(":nombre",   $this->nombre);
        $stmt->bindParam(":email",    $this->email);
        $stmt->bindParam(":telefono", $this->telefono);

        return $stmt->execute();
    }

    public function actualizar() {
        $query = "UPDATE {$this->tabla}
                  SET nombre   = :nombre,
                      email    = :email,
                      telefono = :telefono
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->nombre   = htmlspecialchars(strip_tags($this->nombre));
        $this->email    = htmlspecialchars(strip_tags($this->email));
        $this->telefono = htmlspecialchars(strip_tags($this->telefono));
        $this->id       = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":nombre",   $this->nombre);
        $stmt->bindParam(":email",    $this->email);
        $stmt->bindParam(":telefono", $this->telefono);
        $stmt->bindParam(":id",       $this->id,     PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function eliminar() {
        $query = "DELETE FROM {$this->tabla} WHERE id = :id";
        $stmt  = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function emailExiste() {
        $query = "SELECT id FROM {$this->tabla}
                  WHERE email = :email AND id != :id
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":id",   $this->id ?? 0, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>
