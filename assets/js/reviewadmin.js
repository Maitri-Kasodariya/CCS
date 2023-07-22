
        function renderStars(rating) {
          let starHTML = '';
          for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
              starHTML += '<i class="star checked fas fa-star"></i>';
            } else {
              starHTML += '<i class="star fas fa-star"></i>';
            }
          }
          return starHTML;
        }
     