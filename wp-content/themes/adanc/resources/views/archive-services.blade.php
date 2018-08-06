@extends('layouts.app')
@section('content')
  <!-- @include('partials.page-header') -->
  <div class="page-header" style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/images/staff.jpg')">
    <h1>Our services</h1>
  </div>

  @php $posts = $fields['title']; @endphp
    <div class="container">
      @while (have_posts()) @php the_post() @endphp
      <div class="staff-member member" id="@php global $post; $post_slug=$post->post_name; echo $post_slug; @endphp">

        <div class="row">
          <div class="col m3" id="bio-pic">
            <img src="{!! get_the_post_thumbnail_url($id, 'medium') !!}"/>
          </div>

          <div class="col m9" id="bio-info">
            <h3>{!! get_the_title() !!}</h3>

            @php the_content() @endphp
          </div>

        </div>
      </div>
      <hr>
      @endwhile
    </div>

@endsection
