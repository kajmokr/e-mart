
<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <h2>Create Bid</h2>
        <ol class="breadcrumb">
            <li>
                <a href="index.html">Home</a>
            </li>
            <li class="active">
                <strong>Create Bid</strong>
            </li>
        </ol>
    </div>
</div>
<div class="wrapper wrapper-content animated fadeInRight ecommerce">
    <div ng-controller="createBidCtrl" class="row">
        <div class="col-lg-12">
            <div  class="tabs-container">

                <tabset>
                    <tab>
                        <tab-heading>
                            Bid Info
                        </tab-heading>
                        <div  class="panel-body">
                            <fieldset class="form-horizontal">
                                <!--AUCTION TITLE -->
                                <div class="form-group"><label class="col-sm-2 control-label">Auction Name:</label>
                                <?php
                                echo $_GET["other"];
                                ?>
                                </div>
                                </br>
                                <!--AUCTION BID PRICE TITLE -->
                                <div class="form-group"><label class="col-sm-2 control-label">Bid Price:</label>
                                    <div class="col-sm-10"><input type="text" data-ng-model="data.bidPrice" class="form-control" placeholder="£160.00"></div>
                                </div>
                                <div>
                                    <button class="btn btn-primary" ng-click="data.createBid()">Create Bid</button>
                                </div>
                            </fieldset>

                        </div>
                    </tab>
                </tabset>
            </div>
        </div>
    </div>

</div>