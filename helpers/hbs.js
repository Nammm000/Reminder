const express = require("express");
const moment = require("moment");
const router = express.Router();
const readline = require("readline");
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format);
  },
  convertMiliseconds: function (miliseconds, format) {
    var days,
      hours,
      minutes,
      seconds,
      total_hours,
      total_minutes,
      total_seconds;

    total_seconds = parseInt(Math.floor(miliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));

    seconds = parseInt(total_seconds % 60);
    minutes = parseInt(total_minutes % 60);
    hours = parseInt(total_hours % 24);

    switch (format) {
      case "s":
        return total_seconds;
      case "m":
        return total_minutes;
      case "h":
        return total_hours;
      case "d":
        return days;
      default:
        if (days > 0) {
          return (
            days + " d, " + hours + " h, " + minutes + " m, " + seconds + " s"
          );
        } else if (hours > 0) {
          return hours + " h, " + minutes + " m, " + seconds + " s";
        } else if (hours > 0) {
          return minutes + " m, " + seconds + " s";
        }
        return seconds + " s";
    }
    /*var cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      d = Math.floor(miliseconds / cd),
      h = Math.floor((miliseconds - d * cd) / ch),
      m = Math.round((miliseconds - d * cd - h * ch) / 60000),
      pad = function (n) {
        return n < 10 ? "0" + n : n;
      };
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
      d++;
      h = 0;
    }
    return d + "day" + h + "hour" + m + "minutes";*/
  },
  timeDiff: function (date1) {
    return Math.abs(date1 - Date.now());
  },
  Alert: function (storyId, setTime, title, body) {
    if (Date.now() >= setTime) {
      //popup.alert({
      //  content: title + " in time " + setTime + "\n" + body,
      //});
      //alert(title + " in time " + setTime);
      //alert(body);
      //let story = Story.findById(storyId).lean();
      Story.remove({ _id: storyId });
      /*router.delete("/${storyId}", ensureAuth, async (req, res) => {
        window.alert(title + " in time " + setTime);
        window.alert(body);
        try {
          let story = await Story.findById(storyId).lean();

          if (!story) {
            return res.render("error/404");
          }

          if (story.user != req.user.id) {
            res.redirect("/stories");
          } else {
            await Story.remove({ _id: storyId });
            res.redirect("/stories");
          }
        } catch (err) {
          console.error(err);
          return res.render("error/500");
        }
      });*/
    }
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue left"><i class="fas fa-edit fa-small" title="Edit"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}" class="left"><i class="fas fa-edit" title="Edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  deleteIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<form action="/stories/${storyId}" method="POST" id="delete-form" 
        onclick="return confirm('Are you sure you want to delete this table?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <button type="submit" class="btn-floating halfway-fab red">
                        <i class="fas fa-trash" title="Delete"></i>
                    </button>
                </form>`;
      } else {
        return `<form action="/stories/${storyId}" method="POST" id="delete-form" 
        onclick="return confirm('Are you sure you want to delete this table?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <button type="submit" class="btn-floating halfway-fab red">
                        <i class="fas fa-trash" title="Delete"></i>
                    </button>
                </form>`;
      }
    } else {
      return "";
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
