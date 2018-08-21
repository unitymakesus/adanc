@php
  $link = (get_field('uploaded_file') == 1) ? get_the_permalink() : get_field('link');
  $topic_list = wp_get_post_terms(get_the_id(), 'resource-topic', array('fields' => 'names'));
  $type_list = wp_get_post_terms(get_the_id(), 'resource-type', array('fields' => 'names'));
  $source_list = wp_get_post_terms(get_the_id(), 'resource-source', array('fields' => 'names'));
@endphp

<div class="resource" itemscope itemtype="http://schema.org/CreativeWork">
  <h3 itemprop="name"><a href="{{ $link }}" target="_blank" rel="noopener" itemprop="url">{{ the_title() }}</a></h3>

  @if (!empty($topic_list))
    @php
      foreach ($topic_list as &$topic) :
        $topic = '<span itemprop="about">' . $topic . '</span>';
      endforeach;
    @endphp
    <div class="meta"><span class="label">Topic:</span>
      {!! implode(', ', $topic_list) !!}
    </div>
  @endif

  @if (!empty($type_list))
    @php
      foreach ($type_list as &$type) :
        $type = '<span itemprop="learningResourceType">' . $type . '</span>';
      endforeach;
    @endphp
    <div class="meta"><span class="label">Type:</span>
      {!! implode(', ', $type_list) !!}
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
  @endif

  <div class="content" itemprop="description">{!! get_field('description') !!}</div>
</div>
