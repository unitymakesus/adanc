<?php

/**
 * This file is part of the AuthnetJSON package.
 *
 * (c) John Conde <stymiee@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JohnConde\Authnet;

/**
 * Exception that is throw when invalid parameters are passed to a method that are not otherwise throwing an exception
 *
 * @package    AuthnetJSON
 * @author     John Conde <authnet@johnconde.net>
 * @copyright  John Conde <authnet@johnconde.net>
 * @license    http://www.apache.org/licenses/LICENSE-2.0.html Apache License, Version 2.0
 * @link       https://github.com/stymiee/authnetjson
 */
class AuthnetInvalidParameterException Extends AuthnetException {}