@extends('layouts.app')
@section('content')
  <!-- @include('partials.page-header') -->
  <div class="page-header">
    <h1>Our Staff</h1>
  </div>

  @php $posts = $fields['title']; @endphp
    <div class="container content-wrapper">
      @while (have_posts()) @php the_post() @endphp
      <div class="staff-member member">
        <div class="row">
          <div class="col m3 bio-pic">
            {!! get_the_post_thumbnail(get_the_ID(), 'medium') !!}
          </div>

          <div class="col m9">
            <div class="row">
              <div class="col m12">
                <h2>{!! get_the_title() !!}</h2>
              </div>
            </div>

            <div class="row">
              <div class="col m5 bio-info">
                @if (!empty($title = get_field('title')))
                  <h3>{{$title}}</h3>
                @endif

                <p>
                @if (!empty($extension = get_field('extension')))
                  {{$extension}}
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

              <div class="col m7 bio-facts">
                @if (!empty($facts = get_field('facts')))
                  <h3>Interesting Facts</h3>
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
