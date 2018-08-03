@extends('layouts.app')
@section('content')
  <!-- @include('partials.page-header') -->
  <div class="page-header" style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/images/staff.jpg')">
    <h1>{!! App::title() !!}</h1>
  </div>

  @php $posts = $fields['title']; @endphp
    <div class="container content-wrapper">
      @while (have_posts()) @php the_post() @endphp
      <div class="staff-member member">
        <div class="row">
          <div class="col m3" id="bio-pic">
            <img src="{!! get_the_post_thumbnail_url($id, 'medium') !!}"/>
          </div>

          <div class="col m9">
            <div class="row">
              <div class="col m12">
                <h3>{!! get_the_title() !!}</h3>
              </div>
            </div>

            <div class="row">
              <div class="col m5" id="bio-info">
                @if (!empty($title = get_field('title')))
                  <p>{{$title}}</p>
                @endif

                <p>919.833.1117
                @if (!empty($extension = get_field('extension')))
                  Ext. {{$extension}}
                @endif
                </p>

                @if (!empty($email = get_field('email')))
                  <a href="mailto:{{$email}}">{{$email}}</a>
                @endif

                @if (!empty($year = get_field('year_joined')))
                  <p>Joined ADA in {{$year}}</p>
                @endif

                @if (!empty($linkedin = get_field('linkedin')))
                  <a href="{{$linkedin}}" target="_blank">Linkedin</a>
                @endif
              </div>

              <div class="col m7" id="bio-facts">
                @if (!empty($facts = get_field('facts')))
                  <p>Interesting Facts</p>
                  {!! $facts !!}
                @endif
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr>
      @endwhile
    </div>

@endsection
