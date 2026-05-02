<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Usuario.php";

$database = new Database();
$db       = $database->getConnection();
$usuario  = new Usuario($db);

$data = json_decode(file_get_contents("php://input"));

$metodo = $_SERVER["REQUEST_METHOD"];
$id     = isset($_GET["id"]) ? (int)$_GET["id"] : null;

switch ($metodo) {

    case "GET":
        if ($id) {
            $usuario->id = $id;
            if ($usuario->leerUno()) {
                echo json_encode([
                    "id"        => $usuario->id,
                    "nombre"    => $usuario->nombre,
                    "email"     => $usuario->email,
                    "telefono"  => $usuario->telefono,
                ]);
            } else {
                http_response_code(404);
                echo json_encode(["mensaje" => "Usuario no encontrado."]);
            }
        } else {
            $stmt    = $usuario->leerTodos();
            $lista   = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($lista);
        }
        break;

    case "POST":
        if (empty($data->nombre) || empty($data->email)) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Nombre y email son obligatorios."]);
            break;
        }
        $usuario->id      = 0;
        $usuario->nombre  = $data->nombre;
        $usuario->email   = $data->email;
        $usuario->telefono = $data->telefono ?? "";

        if ($usuario->emailExiste()) {
            http_response_code(409);
            echo json_encode(["mensaje" => "El email ya está registrado."]);
            break;
        }
        if ($usuario->crear()) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Usuario creado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "No se pudo crear el usuario."]);
        }
        break;

    case "PUT":
        if (!$id) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Se requiere el ID del usuario."]);
            break;
        }
        if (empty($data->nombre) || empty($data->email)) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Nombre y email son obligatorios."]);
            break;
        }
        $usuario->id       = $id;
        $usuario->nombre   = $data->nombre;
        $usuario->email    = $data->email;
        $usuario->telefono = $data->telefono ?? "";

        if ($usuario->emailExiste()) {
            http_response_code(409);
            echo json_encode(["mensaje" => "El email ya está en uso por otro usuario."]);
            break;
        }
        if ($usuario->actualizar()) {
            echo json_encode(["mensaje" => "Usuario actualizado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "No se pudo actualizar el usuario."]);
        }
        break;

    case "DELETE":
        if (!$id) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Se requiere el ID del usuario."]);
            break;
        }
        $usuario->id = $id;
        if ($usuario->eliminar()) {
            echo json_encode(["mensaje" => "Usuario eliminado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "No se pudo eliminar el usuario."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["mensaje" => "Método no permitido."]);
        break;
}
?>
