class HistoryController < ApplicationController
  def index
    @history = History.all
  end

  def create
    @history = History.new(:search => params[:name])
    respond_to do |format|
      if @history.save
        format.json { render :nothing => true }
      end
    end
  end

  def destroy
    @history = History.find(params[:id])
    @history.destroy
    respond_to do |format|
      format.html { redirect_to :controller => 'history', :action => 'index' }
    end
  end
  
  def show
    @history = History.find(params[:id])
  end
  
end
