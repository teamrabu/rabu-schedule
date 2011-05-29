# encoding: UTF-8
# The encoding line is required on Ruby 1.9 for the
# es5-shim.js file, which has a non-ASCII character in it.

# Rabu Schedule: A tool for collaborative product scheduling.
# Copyright (C) 2011 Titanium I.T. LLC. All rights reserved.
#
# This program is free software: you can redistribute it and/or modify it 
# under the terms of the GNU Affero General Public License as published 
# by the Free Software Foundation, either version 3 of the License, or 
# (at your option) any later version.
# 
# This program is distributed in the hopes that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program (see GPL.txt). If not, see
# <http://www.gnu.org/licenses/>.


require "generator"

print Rabu.new(DATA.read, STDIN.read).html

__END__
