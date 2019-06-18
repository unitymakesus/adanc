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
      <div class="container main-description">
        <h1>{!! App::title() !!}</h1>
        @if($overview)
          <p>{{ $overview['description'] }}</p>
          @if(($overview['button']))
            @foreach($overview['button'] as $button)
                <a class="btn" href="{{$button['button_link']}}"><span>{{$button['button_label']}}</span></a>
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
                    <div class="service-content">
                      <h3>{{$service['service_title']}}</h3>
                      <p>{{$service['service_description']}}</p>
                    </div>
                  </div>
                </a>
              </div>
              @endforeach
            @endif
          </div>
        @endif
      </div>
    </section>

    @if(!empty($callout['callout_title']))
    <section class="overview" aria-label="overview">
      <div class="container">
        <div class="row">
          <div class="col s12 m6 offset-m3 featured-post">
            <h2>{{ $callout['callout_title'] }}</h2>
            {!! $callout['callout_info'] !!}
            <a class="btn" href="{{ $callout['callout_link'] }}">Learn More</a>
          </div>
        </div>
      </div>
    </section>
    @endif
  @endwhile
@endsection
