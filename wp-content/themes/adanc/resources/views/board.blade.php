{{--
  Template Name: Board Page
--}}

@extends('layouts.app')

@section('content')
  @while(have_posts()) @php the_post() @endphp
    @include('partials.page-header')
    @include('partials.content-page')
  @endwhile

  <div class="board-members">
    @if($board)
      <div class="container content-wrapper">
        <div class="row">
        @php $i = 0; @endphp
        @foreach($board as $member)
          @if($i % 4 === 0)
            </div><div class="row">
          @endif
          <div class="member col s6 m3">
            <img src="{{$member['photo']}}" alt="" />
            <h3>{{$member['name']}}</h3>
            <p>{{$member['role']}}</p>
          </div>
          @php $i++; @endphp
        @endforeach
        </div>
      </div>
    @endif
  </div>

  <!-- @while(have_posts()) @php the_post() @endphp

    @if($board)
      @foreach($board as $member)
        @endforeach
    @endif
  @endwhile -->
@endsection
