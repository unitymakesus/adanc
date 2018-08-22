{{--
  Template Name: Home Page
--}}

@extends('layouts.app')

@section('content')
  @while(have_posts()) @php the_post() @endphp
    <section class="hero" aria-label="hero">
      <img src="{!! get_the_post_thumbnail_url($id, 'full') !!}"/>
    </section>

    <section class="overview" aria-label="overview">
      <div class="container">
        <h1>{!! App::title() !!}</h1>
        @if($overview)
          <p>{{ $overview['description'] }}</p>
          @if(($overview['button']))
            @foreach($overview['button'] as $button)
                <a class="btn" href="{{$button['button_link']}}">{{$button['button_label']}}</a>
            @endforeach
          @endif
        @endif
      </div>
    </section>

    <section class="services" aria-label="services">
      <div class="container">
        <h2>Our Services</h2>
        @if($overview)
          <p>{{ $services['description'] }}</p>
          <div class="row">
            @if(($services['service_item']))
              @foreach($services['service_item'] as $service)
              <div class="col s12 m6 l3">
                <a href="{{$service['service_link']}}">
                  <div class="service-item" style="background-image: url({{$service['service_image']}})">
                    <h3>{{$service['service_title']}}</h3>
                  </div>
                </a>
              </div>
              @endforeach
            @endif
          </div>
        @endif
      </div>
    </section>

    <section class="overview" aria-label="overview">
      <div class="container">
        <div class="row">
          <div class="col s12 m5 featured-post">
            <h2>Independent Living Blog</h2>
            <p>Keep up-to-date on the latest news and advocacy efforts for the disability community.</p>
            <?php $the_query = new WP_Query( 'posts_per_page=1' ); ?>
              <?php while ($the_query -> have_posts()) : $the_query -> the_post(); ?>
                  <?php if (has_post_thumbnail())
                    the_post_thumbnail( 'medium' ); ?>
                    <h3><?php the_title(); ?></h3>
                    <?php the_excerpt(__('(more…)')); ?>
                    <a class="btn" href="<?php the_permalink() ?>">Read More</a>
              <?php
                endwhile;
                wp_reset_postdata();
              ?>
          </div>
          <div class="col s12 m5 offset-m2">
            @if($information)
            <div class="row">
              <h2>{{ $information['volunteer_title'] }}</h2>
              <p>{{ $information['volunteer_description'] }}</p>
              <a class="btn" href="{{ $information['volunteer_link'] }}">Learn how to help</a>
            </div>
            <div class="row">
              <h2>{{ $information['newsletter_title'] }}</h2>
              <p>{{ $information['newsletter_description'] }}</p>
              {!! do_shortcode('[ctct form="1611"]') !!}
            </div>
          @endif
        </div>
      </div>
      </div>
    </section>
  @endwhile
@endsection
