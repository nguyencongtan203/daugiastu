<template>
  <div class="dropdown" ref="root" :style="{ '--dd-active': activeColor }">
    <!-- Trigger -->
    <div
      class="input dropdown-trigger"
      :class="[
        { error: error && errorMessage },
        disabled && 'disabled',
        open && 'active',
      ]"
      role="combobox"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="menuId"
      :tabindex="disabled ? -1 : 0"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="truncate" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <svg
        class="chevron"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          :stroke="open ? activeColor : error && errorMessage ? '#e03131' : '#64748b'"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Menu -->
    <transition name="dropdown-fade">
      <div
        v-if="open"
        :id="menuId"
        class="dropdown-menu"
        role="listbox"
        :aria-activedescendant="activeOptionId"
        @keydown.stop.prevent="onMenuKeydown"
        tabindex="-1"
        ref="menu"
      >
        <ul class="dropdown-list" ref="list">
          <li
            v-for="(opt, idx) in normalizedOptions"
            :key="getVal(opt)"
            class="dropdown-item"
            :class="{
              active: idx === hoveredIndex,
              selected: getVal(opt) === modelValue,
            }"
            role="option"
            :id="optionId(idx)"
            :aria-selected="getVal(opt) === modelValue ? 'true' : 'false'"
            @mouseenter="hoveredIndex = idx"
            @mouseleave="hoveredIndex = -1"
            @click="select(opt)"
          >
            <span class="label">{{ getLabel(opt) }}</span>
            <svg
              v-if="getVal(opt) === modelValue"
              class="check"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M20 6L9 17l-5-5"
                fill="none"
                :stroke="activeColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: { type: Array, default: () => [] },
  optionValue: { type: String, default: "value" },
  optionLabel: { type: String, default: "label" },
  placeholder: { type: String, default: "-- Chưa chọn --" },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: "" },
  maxHeight: { type: Number, default: 240 },
  activeColor: { type: String, default: "#127fcf" },
});

const emit = defineEmits(["update:modelValue", "change", "open", "close"]);

const root = ref(null);
const menu = ref(null);
const list = ref(null);
const open = ref(false);
const hoveredIndex = ref(-1);
const menuId = `dd-${Math.random().toString(36).slice(2)}`;

const normalizedOptions = computed(() => props.options || []);
const selectedIndex = computed(() =>
  normalizedOptions.value.findIndex((o) => getVal(o) == props.modelValue)
);
const selectedLabel = computed(() => {
  const idx = selectedIndex.value;
  return idx >= 0 ? getLabel(normalizedOptions.value[idx]) : "";
});
const activeOptionId = computed(() =>
  hoveredIndex.value >= 0 ? optionId(hoveredIndex.value) : ""
);

function getVal(opt) {
  return typeof opt === "object" ? opt[props.optionValue] : opt;
}
function getLabel(opt) {
  return typeof opt === "object" ? opt[props.optionLabel] : String(opt);
}
function optionId(i) {
  return `${menuId}-opt-${i}`;
}

function toggle() {
  if (props.disabled) return;
  open.value ? close() : openMenu();
}
function openMenu() {
  if (props.disabled || open.value) return;
  open.value = true;
  emit("open");
  hoveredIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0;
  requestAnimationFrame(() => {
    menu.value?.focus();
    scrollIntoView(hoveredIndex.value);
  });
}
function close() {
  if (!open.value) return;
  open.value = false;
  hoveredIndex.value = -1;
  emit("close");
}
function select(opt) {
  const val = getVal(opt);
  if (val !== props.modelValue) {
    emit("update:modelValue", val);
    emit("change", val);
  }
  close();
}
function onTriggerKeydown(e) {
  if (props.disabled) return;
  if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
    e.preventDefault();
    openMenu();
  }
}
function onMenuKeydown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    close();
    return;
  }
  if (e.key === "Tab") {
    close();
    return;
  }
  const max = normalizedOptions.value.length - 1;
  if (e.key === "ArrowDown") {
    hoveredIndex.value = Math.min(
      max,
      hoveredIndex.value < 0 ? 0 : hoveredIndex.value + 1
    );
    scrollIntoView(hoveredIndex.value);
  } else if (e.key === "ArrowUp") {
    hoveredIndex.value = Math.max(0, hoveredIndex.value < 0 ? 0 : hoveredIndex.value - 1);
    scrollIntoView(hoveredIndex.value);
  } else if (["Enter", " "].includes(e.key)) {
    if (hoveredIndex.value >= 0) {
      select(normalizedOptions.value[hoveredIndex.value]);
    }
  }
}
function onDocClick(e) {
  if (!root.value) return;
  if (!root.value.contains(e.target)) close();
}
function scrollIntoView(idx) {
  const listEl = list.value;
  if (!listEl || idx < 0) return;
  const itemEl = listEl.children[idx];
  if (!itemEl) return;
  const itemTop = itemEl.offsetTop;
  const itemBottom = itemTop + itemEl.offsetHeight;
  const viewTop = listEl.scrollTop;
  const viewBottom = viewTop + listEl.clientHeight;
  if (itemTop < viewTop) listEl.scrollTop = itemTop;
  else if (itemBottom > viewBottom) listEl.scrollTop = itemBottom - listEl.clientHeight;
}

onMounted(() => document.addEventListener("click", onDocClick, { passive: true }));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
}

/* Trigger: underline giống input + line khi active/mở */
.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 38px;
  cursor: pointer;
  user-select: none;
  border-radius: 0px;
  /* đảm bảo có line dưới ngay cả khi rule .input bị override ở nơi khác */
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #d1d5db;
}
.dropdown-trigger .placeholder {
  color: #94a3b8;
}
.dropdown-trigger.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.dropdown-trigger .chevron {
  flex: 0 0 auto;
}

/* Khi hover/focus/đang mở: line đổi màu như input focus */
.dropdown-trigger:hover {
  border-bottom-color: color-mix(in srgb, var(--dd-active, #127fcf) 45%, white);
}
.dropdown-trigger:focus {
  outline: none;
  border-bottom-color: var(--dd-active, #127fcf);
}
.dropdown-trigger.active {
  border-bottom-color: var(--dd-active, #127fcf);
}

/* Error state: underline đỏ */
.dropdown-trigger.error {
  border-bottom-color: #e03131 !important;
  animation: shake .22s ease-in-out;
}

/* Menu */
.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 50;
  background: linear-gradient(180deg, #ffffff, #f9fbfd);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 14px 28px -14px rgba(30, 41, 59, 0.35);
  padding: 6px;
}
.dropdown-list {
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
  margin: 0;
  list-style: none;
}

/* Item */
.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 14;
  color: #1e293b;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background 0.18s, color 0.18s, transform 0.18s;
  cursor: pointer;
}
.dropdown-item:hover,
.dropdown-item.active {
  background: #edf6ff;
  color: #0b5ea8;
}
.dropdown-item.selected {
  background: linear-gradient(180deg, #eaf3ff, #f6fbff);
  color: #0b5ea8;
  font-weight: 600;
}
.dropdown-item .check {
  color: var(--dd-active, #127fcf);
}

/* Transition */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Scrollbar nhẹ */
.dropdown-list::-webkit-scrollbar {
  width: 8px;
}
.dropdown-list::-webkit-scrollbar-track {
  background: transparent;
}
.dropdown-list::-webkit-scrollbar-thumb {
  background: #d3dbe3;
  border-radius: 6px;
}
.dropdown-list::-webkit-scrollbar-thumb:hover {
  background: #b8c3ce;
}

/* ========= Hiệu ứng ========= */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-3px);
  }

  50% {
    transform: translateX(3px);
  }

  75% {
    transform: translateX(-2px);
  }
}
</style>
