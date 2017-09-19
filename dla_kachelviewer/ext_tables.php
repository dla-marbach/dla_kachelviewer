<?php

  if (!defined ('TYPO3_MODE')) die ('Access denied.');

  $pluginSignature = str_replace('_', '', $_EXTKEY) . '_dlakachelviewer';

  $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_excludelist'][$pluginSignature] = 'layout, select_key';
  $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';
  \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue($pluginSignature, 'FILE:EXT:' . $_EXTKEY . '/Configuration/FlexForms/DlaKachelviewer.xml');

  \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
    $_EXTKEY,
    'DlaKachelviewer',
    'DLA Kachelviewer'
  );
  
?>