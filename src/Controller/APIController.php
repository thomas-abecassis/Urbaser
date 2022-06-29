<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class APIController extends AbstractController
{
    /**
     * @Route("/api/tools", name="api_tools")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getTools()
    {
        $users = [
            [
                'name' => "Olususi Oluyemi",
                'url' => 'google.com'
            ],
            [
                'name' => 'Camila Terry',
                'url' => 'google.com'
            ]
        ];
    
        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($users));
        
        return $response;
    }
}
