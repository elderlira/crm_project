<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  color: string
}>()

const bgColor = computed(() => {
  const map: Record<string, string> = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500'
}

  return map[props.color] || 'bg-gray-500'
})
</script>
    
    <template>
      <div class="bg-white rounded-xl shadow-md p-6 relative">
        
        <!-- Ícone colorido -->
        <div
        class="absolute -top-4 left-6 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
        :class="bgColor"
        >
        ●
        </div>
    
        <div class="mt-6 text-center">
          <h2 class="text-3xl font-semibold text-gray-700">
            {{ value }}
          </h2>
          <p class="text-gray-500 mt-2 text-sm">
            {{ title }}
          </p>
        </div>
    
      </div>
    </template>