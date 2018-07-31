{{--
  Template Name: Home Page
--}}

@extends('layouts.app')

@section('content')
  @while(have_posts()) @php the_post() @endphp
    <section class="hero" aria-label="hero">
      <img src="{!! get_the_post_thumbnail_url($id, 'full') !!}"/>
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
                <div class="service-item" style="background-image: url({{$service['service_image']}})">
                  <h3><a href="{{$service['service_link']}}">{{$service['service_title']}}</a></h3>
                </div>
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
          <div class="col s12 m6">
            <h2>Independent Living Blog</h2>
            <p>post will go here</p>
          </div>
          <div class="col s12 m6">
            @if($information)
            <div class="row">
              <h2>{{ $information['volunteer_title'] }}</h2>
              <p>{{ $information['volunteer_description'] }}</p>
              <a class="btn" href="{{ $information['volunteer_link'] }}">Learn how to help</a>
            </div>
            <div class="row">
              <h2>{{ $information['newsletter_title'] }}</h2>
              <p>{{ $information['newsletter_description'] }}</p>
              <form id="signup">
                <div class="input-field">
                  <input name="email" type="text" />
                  <label for="email" class="">Email</label>
                  <button class="formbtn">Join</button>
                </div>
              </form>
            </div>
          @endif
        </div>
      </div>
      </div>
    </section>
  @endwhile
@endsection
