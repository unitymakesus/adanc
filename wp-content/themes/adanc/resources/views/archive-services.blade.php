@extends('layouts.app')
@section('content')
  <!-- @include('partials.page-header') -->
  <div class="page-header" style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/images/staff.jpg')">
    <h1>Our services</h1>
  </div>

  @php $posts = $fields['title']; @endphp
    <div class="container content-wrapper">
      @while (have_posts()) @php the_post() @endphp
      <div class="staff-member member" id="{!! get_the_title() !!}">
        <div class="row">
          <div class="col m4" id="bio-pic">
            <img src="{!! get_the_post_thumbnail_url($id, 'medium') !!}"/>
          </div>

          <div class="col m8" id="bio-info">
            <h3>{!! get_the_title() !!}</h3>

            @if (!empty($description = get_field('description')))
              {!! $description !!}
            @endif

            @if (!empty($phone = get_field('phone_number')))
              <a href="{{$phone}}">{{$phone}}</a>
            @endif

            @if (!empty($email = get_field('email')))
              <br><a href="mailto:{{$email}}">{{$email}}</a>
            @endif
          </div>

        </div>
      </div>
      <hr>
      @endwhile
    </div>

@endsection
