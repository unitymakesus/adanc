@extends('layouts.app')

@section('content')
  <div class="page-header">
    <h2>Blog</h2>
  </div>

  @while(have_posts()) @php the_post() @endphp
    @include('partials.content-single-'.get_post_type())
  @endwhile
@endsection
