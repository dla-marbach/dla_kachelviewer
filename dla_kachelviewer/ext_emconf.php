<?php
  $EM_CONF[$_EXTKEY] = array(
    'title' => 'DLA Kachelviewer',
    'description' => 'DLA Kachelviewer auf Basis von OpenSeadragon',
    'category' => 'plugin',
    'author' => 'Alexander Harm',
    'author_company' => 'DLA Marbach',
    'author_email' => 'wdv@dla-marbach.de',
    'dependencies' => 'extbase,fluid',
    'state' => 'beta',
    'clearCacheOnLoad' => '1',
    'version' => '2.0.0',
    'constraints' => array(
      'depends' => array(
        'typo3' => '6.2.0-0.0.0',
        'extbase' => '1.0.0-0.0.0',
        'fluid' => '1.0.0-0.0.0',
        )
      )
    );
?>