class CreateHistories < ActiveRecord::Migration
  def change
    create_table :histories do |t|
      t.string :search

      t.timestamps
    end
  end
end
