@extends('layouts.app')

@section('content')
  <!-- @include('partials.page-header') -->
  <div class="page-header" style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/images/blog.jpg')">
    <h1>{!! App::title() !!}</h1>
  </div>


  @if (!have_posts())
    <div class="alert alert-warning">
      {{ __('Sorry, no results were found.', 'sage') }}
    </div>
    {!! get_search_form(false) !!}
  @endif

  <div class="container content-wrapper">
    <div class="row post-container">
      @while (have_posts()) @php the_post() @endphp
        @include('partials.content-'.get_post_type())
      @endwhile
    </div>
  </div>

  {!! get_the_posts_navigation() !!}
@endsection
