import React, { Component } from 'react';

class ImageCleaner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show_confirm_block: false
    }
  }

  componentDidMount() {
    document.getElementById("ic_input").focus();
  }
  
  prelanderSearch = () => {
    let ic_input_value = document.getElementById("ic_input").value;
    document.querySelector(".ic_trashlist_block").classList.remove('animation');
    document.querySelector(".notification_block").classList.remove("show");

    //create anchor element to simplify url parse(pathname, parameters, etc.)
    let temp_link = document.createElement("a");
    temp_link.href = ic_input_value;

    //check if prelander link is valid
    if(!ic_input_value.includes('http:')) {
      alert("Please, enter a valid prelander link ಠ_ಠ")
      return;
    }

    //send link to server
    // let url = "http://localhost:1535/find_trash_images";
    let url = "http://sitish.com:1535/find_trash_images";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        prelander_link: ic_input_value,
        prelander_path: temp_link.pathname,
      })
    })
    .then(response => response.json())
    .then(data => {
      let filenames_to_delete = "";
      if(data.status === "success") {
        if(data.payload.length > 0) {
          for(let i = 0; i < data.payload.length; i++) {
            filenames_to_delete += data.payload[i].path + '\n';
          }
    
          //shows list of files that will be deleted
          document.querySelector(".ic_trashlist_block").textContent = filenames_to_delete;
          document.querySelector(".ic_trashlist_block").classList.add('opened');
          this.setState({ show_confirm_block: true});
        } else {
          document.querySelector(".ic_trashlist_block").classList.add('animation');
        }
      } else {
        alert(data.payload);
      }
    })
  }

  deleteTrashImages = () => {
    let url = "http://sitish.com:1535/delele_trash_images";
    fetch(url)
    .then(response => response.json())
    .then(data => {
      //clear list of trash filenames
      document.querySelector(".ic_trashlist_block").textContent = "";
      document.querySelector(".ic_trashlist_block").classList.remove('opened');

      this.setState({ show_confirm_block: false});

      //show notification
      document.querySelector(".notification_block").textContent = "Garbage taken out. Magic! (¬‿¬)";
      document.querySelector(".notification_block").classList.add("show");

      //clear input
      document.getElementById("ic_input").value = "";
    })
  }

  render() {
    return (
      <div id="image_cleaner_wrapper">
        <div className="notification_block"></div>
        <h2 className="title">Image Cleaner</h2>
        <div className="ic_search_block">
          <input id="ic_input" className="custom_input" autoComplete="off" placeholder="Enter prelander link.." />
          <button id="ic_search_btn" className="custom_button ic_search_btn" onClick={this.prelanderSearch}>Search</button>
        </div>
        <div className="ic_trashlist_block"></div>
        {
          this.state.show_confirm_block && (
            <div className="ic_confim_delete_block">
              <p>These files will be premanently removed. Are you shure?</p>
              <button id="ic_confirm_btn" className="custom_button ic_confirm_btn" onClick={this.deleteTrashImages}>Confirm!</button>
            </div> 
          )
        }
      </div>
    )
  }
}

export default ImageCleaner;