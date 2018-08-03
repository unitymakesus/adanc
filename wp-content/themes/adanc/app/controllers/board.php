<?php

namespace App;

use Sober\Controller\Controller;

class Board extends Controller
{
  public function board(){
    return get_field('board_member');
  }
}
