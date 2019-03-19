<?php

namespace App;

use Sober\Controller\Controller;

class FrontPage extends Controller
{
  public function overview(){
    return get_field('overview');
  }

  public function services(){
    return get_field('services');
  }


  public function information(){
    return get_field('information');
  }

  public function callout(){
    return get_field('calout');
  }
}
