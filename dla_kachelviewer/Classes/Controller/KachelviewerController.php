<?php

  use \TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
  use \TYPO3\CMS\Core\Utility\GeneralUtility;

  class Tx_DlaKachelviewer_Controller_KachelviewerController extends ActionController {

      public function deepzoomAction() {
        	// Load CSS
		    $this->response->addAdditionalHeaderData('<link rel="stylesheet" type="text/css" href="' . \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::siteRelPath($this->request->getControllerExtensionKey()) . 'Resources/Public/CSS/dla_kachelviewer.css"></link>');
          // Pass variables to JavaScript
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerStoragePath = "' . $this->settings['storagePath'] . '"</script>');
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerStoragePattern = "' . $this->settings['storagePattern'] . '"</script>');
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerShowSearchField = "' . $this->settings['showSearchField'] . '"</script>');
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerObjectID = "' . $this->settings['objectID'] . '"</script>');
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerShowMetadata = "' . $this->settings['metadataShow'] . '"</script>');
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerMetadataID = "' . $this->settings['metadataId'] . '"</script>');
        $this->response->addAdditionalHeaderData('<script type="text/javascript">var dlaKachelviewerPhysPage = "' . $this->settings['physPage'] . '"</script>');
      }
  }

?>