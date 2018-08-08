@php
  $link = (get_field('uploaded_file') == 1) ? get_the_permalink() : get_field('link');
  $topic_list = wp_get_post_terms(get_the_id(), 'resource-topic', array('fields' => 'names'));
  $source_list = wp_get_post_terms(get_the_id(), 'resource-source', array('fields' => 'names'));
@endphp

<div class="resource" itemscope itemtype="http://schema.org/CreativeWork">
  <h3 itemprop="name">{{ the_title() }}</h3>

  @if(has_post_thumbnail())
    <img src="{!! get_the_post_thumbnail_url($id, 'medium') !!}"/>
  @endif

  <!-- @if (!empty($topic_list))
    @php
      foreach ($topic_list as &$topic) :
        $topic = '<span itemprop="about">' . $topic . '</span>';
      endforeach;
    @endphp
    <div class="meta"><span class="label">Topic:</span>
      {!! implode(', ', $topic_list) !!}
    </div>
  @endif

  @if (!empty($source_list))
    @php
      foreach ($source_list as &$source) :
        $source = '<span itemprop="creator">' . $source . '</span>';
      endforeach;
    @endphp
    <div class="meta"><span class="label">Source:</span>
      {!! implode(', ', $source_list) !!}
    </div>
  @endif -->

  <div class="content" itemprop="description">{!! get_field('description') !!}</div>

  @if( get_field('resource_link') )
    <a href="{!! get_field('resource_link') !!}" target="_blank" rel="noopener" itemprop="url">{!! get_field('resource_link') !!}</a>
  @endif
</div>
<hr>
