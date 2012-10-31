class RestaurantsController < ApplicationController
  
  def search
    @restaurant = Restaurant.new
  end
  
  def create
    @restaurant = Restaurant.new(:name => params[:name], :address => params[:address])
    respond_to do |format|
      if @restaurant.save
        # format.html { render :nothing => true }
        format.json { render :nothing => true }
        # format.js {render :nothing => true }
      end
    end  
  end
  
  def index
    @restaurants = Restaurant.all
  end
end
