<template lang="html">
    <component :is="icons[props.iconName as keyof typeof icons] || icons.projectManager"/>
</template>

<script lang="ts" setup>
import clockHistoryIcon from '@/assets/icons/icon_clock-history.svg';
import clockIcon from '@/assets/icons/icon_clock.svg';
import commentIcon from '@/assets/icons/icon_comment.svg';
import dataTableIcon from '@/assets/icons/icon_data-table.svg';
import featherPaperIcon from '@/assets/icons/icon_feather-paper.svg';
import homeIcon from '@/assets/icons/icon_home.svg';
import minusIcon from '@/assets/icons/icon_minus.svg';
import pinOffIcon from '@/assets/icons/icon_pin-off.svg';
import pinIcon from '@/assets/icons/icon_pin.svg';
import plusIcon from '@/assets/icons/icon_plus.svg';
import projectManagerIcon from '@/assets/icons/icon_project-manager.svg';
import recentIcon from '@/assets/icons/icon_recent.svg';
import statisticIcon from '@/assets/icons/icon_statistic.svg';
import twoPagerIcon from '@/assets/icons/icon_two-pager.svg';
import pauseIcon from '@/assets/icons/icon_pause.svg';
import checkIcon from '@/assets/icons/icon_check.svg';
import playIcon from '@/assets/icons/icon_play.svg';
import editIcon from '@/assets/icons/icon_edit.svg';
import editNoteIcon from '@/assets/icons/icon_edit-note.svg';
import tuneIcon from '@/assets/icons/icon_tune.svg';
import arrowBackIcon from '@/assets/icons/icon_arrow-back.svg';
import arrowForwardIcon from '@/assets/icons/icon_arrow-forward.svg';
import closeIcon from '@/assets/icons/icon_close.svg';
import personIcon from '@/assets/icons/icon_person.svg';
import mailIcon from '@/assets/icons/icon_mail.svg';
import calendarIcon from '@/assets/icons/icon_calendar.svg';
import phoneIcon from '@/assets/icons/icon_phone.svg';
import mobileIcon from '@/assets/icons/icon_mobile.svg';
import officeIcon from '@/assets/icons/icon_office.svg';
import attachmentIcon from '@/assets/icons/icon_attachment.svg';
import visibilityIcon from '@/assets/icons/icon_visibility.svg';
import visibilityOffIcon from '@/assets/icons/icon_visibility-off.svg';
import euroIcon from '@/assets/icons/icon_euro.svg';
import trashIcon from '@/assets/icons/icon_trash.svg';
import birthdayIcon from '@/assets/icons/icon_birthday.svg';
import assigneeIcon from '@/assets/icons/icon_assignee.svg';
import dragIcon from '@/assets/icons/icon_drag.svg';
import swapIcon from '@/assets/icons/icon_swap.svg';
import heartIcon from '@/assets/icons/icon_heart.svg';
import dollarCircleIcon from '@/assets/icons/icon_dollar-circle.svg';
import forwardIcon from '@/assets/icons/icon_forward.svg';
import openNewIcon from '@/assets/icons/icon_open-new.svg';
import peopleIcon from '@/assets/icons/icon_people.svg';
import rocketIcon from '@/assets/icons/icon_rocket.svg';
import addTaskIcon from '@/assets/icons/icon_add-task.svg';
import historyIcon from '@/assets/icons/icon_history.svg';
import overviewIcon from '@/assets/icons/icon_overview.svg';
import reopenIcon from '@/assets/icons/icon_reopen.svg';
import settingsIcon from '@/assets/icons/icon_settings.svg';
import refreshIcon from '@/assets/icons/icon_refresh.svg';
import search from '@/assets/icons/icon_search.svg';

const props = defineProps({
    iconName: {
        type: String,
        required: false,
        default: 'project',
    },
});

const icons = {
    projectManager: projectManagerIcon,
    clockHistory: clockHistoryIcon,
    clock: clockIcon,
    comment: commentIcon,
    dataTable: dataTableIcon,
    featherPaper: featherPaperIcon,
    home: homeIcon,
    minus: minusIcon,
    pinOff: pinOffIcon,
    pin: pinIcon,
    plus: plusIcon,
    recent: recentIcon,
    statistic: statisticIcon,
    twoPager: twoPagerIcon,
    pause: pauseIcon,
    check: checkIcon,
    play: playIcon,
    edit: editIcon,
    editNote: editNoteIcon,
    tune: tuneIcon,
    arrowBack: arrowBackIcon,
    arrowForward: arrowForwardIcon,
    close: closeIcon,
    person: personIcon,
    mail: mailIcon,
    calendar: calendarIcon,
    phone: phoneIcon,
    mobile: mobileIcon,
    office: officeIcon,
    attachment: attachmentIcon,
    visibility: visibilityIcon,
    visibilityOff: visibilityOffIcon,
    euro: euroIcon,
    trash: trashIcon,
    birthday: birthdayIcon,
    assignee: assigneeIcon,
    drag: dragIcon,
    swap: swapIcon,
    heart: heartIcon,
    dollarCircle: dollarCircleIcon,
    forward: forwardIcon,
    openNew: openNewIcon,
    people: peopleIcon,
    rocket: rocketIcon,
    addTask: addTaskIcon,
    history: historyIcon,
    overview: overviewIcon,
    reopen: reopenIcon,
    settings: settingsIcon,
    refresh: refreshIcon,
    search: search,
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

svg {
    fill: $primary-color-0;
    height: 100%;
    width: 100%;
}
</style>
